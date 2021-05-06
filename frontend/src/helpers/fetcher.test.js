import { useTodoLists } from '../../helpers/fetcher'

test('returns an array', () => {
  const { todoLists } = useTodoLists()
  expect(todoLists).toBeInstanceOf(Array)
})
