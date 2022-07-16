import type { FormProps } from '@remix-run/react'
import { Form } from '@remix-run/react'
import type { SafeParseSuccess, z } from 'zod'

/**
 * Models the options with which you can customize form rendering.
 */
type FormMeta = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	// FIXME: once we have render props this won't be necessary?
	render?: (errorsList?: string[]) => JSX.Element
}
type FormFieldDef<I extends z.ZodTypeAny = z.ZodTypeAny> = I & {
	_formMeta?: FormMeta
}

/**
 * Wraps a zod object field with metadata so that we can use it to generate a
 * form.
 *
 * @param schema The schema (such as z.date() or z.string()) that you want the
 * form to use to validate the field's value
 * @param meta Props used to render the fields form
 * @returns A zod validator modified to render a form field
 */
export function formField<I extends z.ZodTypeAny>(
	schema: FormFieldDef<I>,
	meta: FormMeta
) {
	schema._formMeta = meta
	return schema
}

type GeneratableSchema = z.ZodObject<{ [key: string]: FormFieldDef }>

/**
 * Models the possible responses
 */
export type FormActionData<T extends GeneratableSchema> =
	| {
			_type: 'FormActionData'
			state: 'success'
			data: SafeParseSuccess<z.output<T>>['data']
	  }
	| {
			_type: 'FormActionData'
			state: 'error'
			validationError: { [key in keyof z.output<T>]+?: { _errors: string[] } }
	  }

type MaybeFormActionData<T extends GeneratableSchema> =
	| FormActionData<T>
	| { _type?: string }
	| undefined

function isFormActionData<T extends GeneratableSchema>(
	data: MaybeFormActionData<T>
): data is FormActionData<T> {
	return !!data && data._type === 'FormActionData'
}

type SchemaFormProps<S extends GeneratableSchema = GeneratableSchema> =
	React.PropsWithChildren<{
		schema: S
		actionData: MaybeFormActionData<S>
	}> &
		FormProps

function fields<S extends SchemaFormProps['schema']>(
	schema: S
): Array<[keyof S, FormMeta]> {
	return Array.from(
		Object.entries(schema._def.shape()).map(([fieldName, zodField]) => [
			// safety: we're literally iterating over the schema
			fieldName as keyof S,
			// safety: the user must have created the schema with formField()
			// functions, which guarantee _formMeta to exist.  The user's entrypoint
			// to this whole library is through that component, so they can't really
			// manipulate the input to this function without doing so fairly
			// intentionally (e.g. by ignoring typescript errors)
			zodField._formMeta!,
		])
	)
}

export async function validateFormData<S extends GeneratableSchema>(
	formData: FormData,
	schema: S
): Promise<FormActionData<S>> {
	const parseResult = await schema.safeParseAsync(
		Object.fromEntries(formData.entries())
	)

	if (parseResult.success) {
		return {
			_type: 'FormActionData',
			state: 'success',
			data: parseResult.data,
		}
	}

	return {
		_type: 'FormActionData',
		state: 'error',
		validationError: parseResult.error.format(),
	}
}

export function SchemaForm({
	schema,
	children,
	actionData,
	...props
}: SchemaFormProps) {
	return (
		<Form {...props}>
			{fields(schema).map(([name, props]) =>
				renderInput(name, props, actionData)
			)}
			{children}
		</Form>
	)
}

function labelNameFromKey(key: string): string {
	return `${key.slice(0, 1).toUpperCase()}${key.slice(1, key.length)}`
}

function errorsIdForKey(key: string | number | symbol) {
	return `${key as string}-errors`
}

// FIXME: this really just needs to be render props based
function renderInput<I extends GeneratableSchema>(
	key: keyof z.output<I>,
	meta: FormMeta,
	actionData: MaybeFormActionData<I>
): JSX.Element | null {
	const errorsForKey = isFormActionData(actionData)
		? actionData.state === 'error'
			? actionData.validationError[key]?._errors
			: undefined
		: undefined

	const inputFrag = meta.render ? (
		meta.render(errorsForKey)
	) : (
		// safety: fuck you typescript...look at the definition of the key for GeneratableSchema
		<div className="mt-1">
			<label
				htmlFor={key as string}
				className="block text-sm font-medium text-gray-700"
			>
				{labelNameFromKey(key as string)}:
			</label>
			<input
				id={key as string}
				name={key as string}
				type="text"
				{...meta}
				aria-disabled={errorsForKey ? true : undefined}
				aria-describedby={errorsIdForKey(key)}
			></input>
		</div>
	)

	let errorFrag = null

	if (errorsForKey) {
		errorFrag = (
			<ul id={errorsIdForKey(key)}>
				{errorsForKey.map((error) => (
					<li
						key={`${key as string}-error-${error}`}
						className="pt-1 text-red-700"
					>
						{error}
					</li>
				))}
			</ul>
		)
	}

	return (
		<div key={key as string}>
			{inputFrag}
			{errorFrag}
		</div>
	)
}
