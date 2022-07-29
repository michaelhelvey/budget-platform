import { z } from 'zod'

export const config = {
	passwordMinLength: 8,
	nameMaxLengh: 50,
	nameMinLength: 1,
}

export const nameField = z
	.string()
	.max(
		config.nameMaxLengh,
		`Provided value is too long (max ${config.nameMaxLengh} character(s))`
	)
	.min(
		config.nameMinLength,
		`Provided value is too short (min ${config.nameMinLength} character(s))`
	)
