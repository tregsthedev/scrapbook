import humanize from 'humanize-string'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import type {
  DeleteUpdateMutationVariables,
  FindUpdateById,
} from 'types/graphql'

const DELETE_UPDATE_MUTATION = gql`
  mutation DeleteUpdateMutation($id: String!) {
    deleteUpdate(id: $id) {
      id
    }
  }
`

const formatEnum = (values: string | string[] | null | undefined) => {
  if (values) {
    if (Array.isArray(values)) {
      const humanizedValues = values.map((value) => humanize(value))
      return humanizedValues.join(', ')
    } else {
      return humanize(values as string)
    }
  }
}

const jsonDisplay = (obj: unknown) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  )
}

const timeTag = (datetime?: string) => {
  return (
    datetime && (
      <time dateTime={datetime} title={datetime}>
        {new Date(datetime).toUTCString()}
      </time>
    )
  )
}

const checkboxInputTag = (checked: boolean) => {
  return <input type="checkbox" checked={checked} disabled />
}

interface Props {
  update: NonNullable<FindUpdateById['update']>
}

const Update = ({ update }: Props) => {
  const [deleteUpdate] = useMutation(DELETE_UPDATE_MUTATION, {
    onCompleted: () => {
      toast.success('Update deleted')
      navigate(routes.updates())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteUpdateMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete update ' + id + '?')) {
      deleteUpdate({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Update {update.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{update.id}</td>
            </tr>
            <tr>
              <th>Accounts slack id</th>
              <td>{update.accountsID}</td>
            </tr>
            <tr>
              <th>Text</th>
              <td>{update.text}</td>
            </tr>
            <tr>
              <th>Attachments</th>
              <td>{update.attachments}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUpdate({ id: update.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(update.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Update
