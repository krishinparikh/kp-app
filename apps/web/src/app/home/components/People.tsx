import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kp-app/ui'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { useCreateUser, useUsers } from '@/hooks.ts'

/**
 * Axios's own three-way split: the server answered, it never answered, or the
 * request never went out. Only the first has words worth showing — on a 4xx
 * `message` is the server's own, put there by the interceptor in `api.ts`.
 */
function readable(error: AxiosError): string {
  if (error.response) return error.message
  if (error.request) {
    return 'Could not reach the server. Check your connection and try again.'
  }
  return 'Something went wrong before the request went out.'
}

const empty = { firstName: '', lastName: '', email: '', dob: '' }

/**
 * The one section wired to the real API — the worked example for `src/hooks.ts`.
 * `useUsers` reads, `useCreateUser` writes, and the list refreshes on its own
 * because the mutation invalidates the list key rather than editing the cache.
 */
export function People() {
  const users = useUsers()
  const createUser = useCreateUser()
  const [draft, setDraft] = useState(empty)

  const field = (name: keyof typeof draft) => ({
    id: name,
    value: draft[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setDraft({ ...draft, [name]: event.target.value }),
    required: true,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>People</CardTitle>
        <CardDescription>Everyone with access to this account.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            // mutate, not mutateAsync — failures land in `createUser.error`
            // instead of becoming an unhandled rejection.
            createUser.mutate(draft, { onSuccess: () => setDraft(empty) })
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input {...field('firstName')} className="w-36" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input {...field('lastName')} className="w-36" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input {...field('email')} type="email" className="w-56" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dob">Date of birth</Label>
            <Input {...field('dob')} type="date" className="w-40" />
          </div>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? 'Adding…' : 'Add person'}
          </Button>
        </form>

        {createUser.error && (
          <Alert variant="destructive">
            <AlertTitle>Could not add that person</AlertTitle>
            <AlertDescription>{readable(createUser.error)}</AlertDescription>
          </Alert>
        )}

        {users.isPending && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((row) => (
              <Skeleton key={row} className="h-9 w-full" />
            ))}
          </div>
        )}

        {users.isError && (
          <Alert variant="destructive">
            <AlertTitle>Could not load people</AlertTitle>
            <AlertDescription>{readable(users.error)}</AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-fit"
              onClick={() => users.refetch()}
            >
              Try again
            </Button>
          </Alert>
        )}

        {users.isSuccess &&
          (users.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nobody yet. Add the first person above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date of birth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">
                      {person.firstName} {person.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {person.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {person.dob}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
      </CardContent>
    </Card>
  )
}
