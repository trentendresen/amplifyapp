import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  Image,
  withAuthenticator,
} from "@aws-amplify/ui-react";

import { listTodos } from "./graphql/queries";
import { createTodo, updateTodo, deleteTodo } from "./graphql/mutations";
import { ListTodosQuery } from "./API";
import * as APIt from "./API";
import callGraphQL from "./Models/graphql-api";
import Todo, { mapListTodos } from "./Models/todo";

// omitted Amplify.configure

function App({ signOut }: any) {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const editData = async () => {
      try {
        const name = "edit";
        const description = "edit desc";
        const id = "e35584e3-f742-4fef-bf5c-4c8e2b56b1c4";
        const response = await callGraphQL<APIt.UpdateTodoMutation>(
          updateTodo,
          {
            input: { name, description, id },
          } as APIt.UpdateTodoMutationVariables
        );
        console.log("edit", response);
      } catch (error) {
        console.error("Unable to edit", error);
      }
    };
  }, []);

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    //console.log({ todos });
  }, [todos]);

  const getTodos = async () => {
    try {
      const todoData = await callGraphQL<ListTodosQuery>(listTodos);
      console.log({ todoData });
      const todos = mapListTodos(todoData);
      console.log({ todos });
      await Promise.all(
        todos.map(async (todo) => {
          console.log(todo);
          if (todo.image) {
            if (todo.name) {
              const url = await Storage.get(todo.name);
              console.log(url);
              todo.image = url;
            }
          }
          return todo;
        })
      );
      setTodos(todos);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  async function createTodos(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const form = new FormData(event.target);
      const image = form.get("image") as any;

      const data = {
        name: form.get("name"),
        description: form.get("description"),
        image: image.name,
      };
      if (!!data.image && data.name) {
        console.log("hey");
        console.log(image.name);
        await Storage.put(data.name.toString(), image, {
          contentType: "image/png",
        });
      }
      const response = await callGraphQL<APIt.CreateTodoMutation>(createTodo, {
        input: {
          name: data.name?.toString(),
          description: data.description?.toString(),
          image: image.name,
          name2: "fuck hole",
        },
      } as APIt.CreateTodoMutationVariables);
      console.log(response);
      getTodos();
      event.target.reset();
    } catch (error) {
      console.error("error creating todos", error);
    }
  }

  const deleteNote = async (todo: Todo) => {
    try {
      console.log("hello");
      todos.forEach(async (element) => {
        const response = await callGraphQL<APIt.DeleteTodoMutation>(
          deleteTodo,
          {
            input: { id: element.id },
          }
        );
        console.log(todos);
        console.log(response);
      });
      console.log("yuur");
    } catch (error) {
      console.error("cant delete", error);
    }
  };

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createTodos}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {todos.map((todo) => (
          <Flex
            key={todo.id || todo.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {todo.name}
            </Text>
            <Text as="strong" fontWeight={700}>
              {` ${todo.name2}`}
            </Text>

            <Text as="span">{todo.description}</Text>
            {todo.image && (
              <Image
                src={todo.image}
                alt={`visual aid for ${todo.name}`}
                style={{ width: 400 }}
              />
            )}
            <Button variation="link" onClick={() => deleteNote(todo)}>
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}
export default withAuthenticator(App);
