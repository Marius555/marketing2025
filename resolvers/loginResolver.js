import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(1, "Password cannot be empty"),
})

export const loginResolver = yupResolver(loginSchema)
export { loginSchema }