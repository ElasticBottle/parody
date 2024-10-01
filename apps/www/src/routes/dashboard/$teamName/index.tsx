import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$teamName/')({
  component: () => <div>Hello /dashboard/$teamId/!</div>,
})
