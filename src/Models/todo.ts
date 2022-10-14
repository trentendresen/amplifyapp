import { ListTodosQuery } from "../API";
import { GraphQLResult } from "@aws-amplify/api";

interface Todo {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  name2?: string;
}

function mapListTodosQuery(
  listTodosQuery: GraphQLResult<ListTodosQuery>
): Todo[] {
  return (
    listTodosQuery.data?.listTodos?.items?.map(
      (todo) =>
        ({
          id: todo?.id,
          name: todo?.name,
          description: todo?.description,
          image: todo?.image,
          name2: todo?.name2,
        } as Todo)
    ) || []
  );
}

export default Todo;
export { mapListTodosQuery as mapListTodos };
