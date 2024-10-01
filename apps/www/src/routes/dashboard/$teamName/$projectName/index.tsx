import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$teamName/$projectName/')({
  component: () => <div>Hello /dashboard/$teamId/$projectId/!</div>,
})
