import { Form } from '@remix-run/react'
import React from 'react'

export function StyledAuthForm({ children }: React.PropsWithChildren<unknown>) {
	return (
		<Form
			method="post"
			className="shadw-sm mt-6 space-y-6 rounded-lg border border-slate-300 bg-white p-8 md:p-10"
		>
			{children}
		</Form>
	)
}

export function StyledAuthSubmitButton({
	children,
}: React.PropsWithChildren<unknown>) {
	return (
		<button
			type="submit"
			className="w-full rounded-md bg-blue-700 py-2 px-4 text-sm text-white hover:bg-blue-700 focus:bg-blue-600"
		>
			{children}
		</button>
	)
}

type StyledAuthInputProps = {
	autoComplete?: string
	autoFocus?: boolean
	error?: string
	labelText: string
	name: string
	required?: boolean
	type: string
}

export const StyledAuthInput = React.forwardRef<
	HTMLInputElement,
	StyledAuthInputProps
>(
	(
		{ error, name, autoComplete, type, labelText, autoFocus, required },
		ref
	) => {
		return (
			<div>
				<label
					htmlFor={name}
					className="block text-sm font-medium text-gray-700"
				>
					{labelText}
				</label>
				<div className="mt-1">
					<input
						ref={ref}
						id={name}
						required={!!required}
						autoFocus={!!autoFocus}
						name={name}
						type={type}
						autoComplete={autoComplete}
						aria-invalid={error ? true : undefined}
						aria-describedby={`${name}-error`}
						className="w-full rounded border border-slate-300 px-2 py-1 shadow-sm focus-visible:border-slate-500 focus-visible:outline-none"
					/>
					{error && (
						<div
							className="pt-1 text-sm font-medium text-red-700"
							id={`${name}-error`}
						>
							{error}
						</div>
					)}
				</div>
			</div>
		)
	}
)
StyledAuthInput.displayName = 'StyledAuthInput'
