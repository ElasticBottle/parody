import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$teamName/$projectName/api-key')({
  component: () => <div>Hello /dashboard/$teamName/$projectName/api-key!</div>
})