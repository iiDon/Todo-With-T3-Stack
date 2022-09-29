import { useEffect, useRef, useState } from "react";
import {
  Container,
  Text,
  Input,
  Box,
  Button,
  Flex,
  Textarea,
  List,
  ListItem,
  ListIcon,
  Spacer,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { CheckIcon, InfoIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { trpc } from "../utils/trpc";
import EditTodo from "../../components/EditTodo";
const Home = () => {
  const utils = trpc.useContext();
  const data = trpc.useQuery(["todo.getAll"]);
  const title = useRef<HTMLInputElement>(null);
  const descreption = useRef<HTMLTextAreaElement>(null);
  const newTodo = trpc.useMutation(["todo.add"], {
    onSuccess: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });
  const deleteTodo = trpc.useMutation(["todo.delete"], {
    onSuccess: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });
  const state = trpc.useMutation(["todo.state"], {
    onSuccess: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });
  if (data.isLoading) return <p>Loading...</p>;
  if (data.isError) return <p>{JSON.stringify(data.isError)}</p>;

  const addTodo = (): void => {
    newTodo.mutate({
      title: title.current?.value || "There is no title",
      descreption: descreption.current?.value || "There is no descreption",
    });

    if (title.current) {
      title.current.value = "";
    }

    if (descreption.current) {
      descreption.current.value = "";
    }
  };

  const handleState = (id: string): void => {
    state.mutate(id);
    utils.invalidateQueries("todo.getAll");
    utils.refetchQueries('')
  };

  const handleDelete = (id: string): void => {
    deleteTodo.mutate(id);
  };

  return (
    <Container maxW="container.sm" my={5} border="1px" borderRadius={7}>
      <Text my={10} align="center" fontSize="3xl">
        My Todo List
      </Text>
      <Input
        isRequired
        ref={title}
        mb={3}
        type={"text"}
        placeholder="Write Your Title Here"
      />
      <Textarea
        ref={descreption}
        mb={3}
        placeholder="Write Your Descreption Here"
      />
      <Button onClick={addTodo} width={"100%"}>
        Add A New Todo
      </Button>

      <List spacing={3} my={12}>
        <Text my={2} align="center" fontSize="xl">
          To Do
        </Text>
        <Grid mb={3}>
          <GridItem w="50%" m={"auto"} h="0.1" bg="gray.500" />
        </Grid>
        {/* Each Todo */}
        {data?.data
          ?.filter((todo) => todo.isDone === false)
          .map((todo) => {
            return (
              <ListItem
                onDoubleClick={() => handleState(todo.id)}
                key={todo.id}
                boxShadow="md"
                p={4}
                borderRadius={7}
                mb={6}
              >
                <Flex>
                  <ListIcon as={InfoIcon} color="gray.500" />
                  <Box>
                    <Text fontSize={20}>{todo.title}</Text>
                    <Text ml={8}>{todo.descreption}</Text>
                  </Box>
                  <Spacer />

                  <Flex>
                    <span className="cursor-pointer">
                      <EditTodo
                        title={todo.title}
                        descreption={todo.descreption}
                        id={todo.id}
                      />
                    </span>

                    <span className="cursor-pointer">
                      <DeleteIcon
                        ml={4}
                        onClick={() => handleDelete(todo.id)}
                        color="red.500"
                      />
                    </span>
                  </Flex>
                </Flex>
              </ListItem>
            );
          })}
      </List>

      <Grid>
        <GridItem w="100%" h="1" bg="gray.500" />
      </Grid>

      <List spacing={3} my={12}>
        <Text my={2} align="center" fontSize="xl">
          Done
        </Text>
        <Grid mb={3}>
          <GridItem w="50%" m={"auto"} h="0.1" bg="gray.500" />
        </Grid>
        {/* Each Todo */}
        {data?.data
          ?.filter((todo) => todo.isDone === true)
          .map((todo) => {
            return (
              <ListItem
                onDoubleClick={() => handleState(todo.id)}
                key={todo.id}
                boxShadow="md"
                p={4}
                borderRadius={7}
                mb={6}
              >
                <Flex>
                  <ListIcon as={CheckIcon} color="green.500" />
                  <Box>
                    <span className="line-through">
                      <Text fontSize={20}>{todo.title}</Text>
                    </span>
                    <Text ml={8}>{todo.descreption}</Text>
                  </Box>
                  <Spacer />

                  <Flex>
                    <span className="cursor-pointer">
                      <EditTodo
                        title={todo.title}
                        descreption={todo.descreption}
                        id={todo.id}
                      />
                    </span>
                    <span className="cursor-pointer">
                      <DeleteIcon
                        ml={4}
                        onClick={() => handleDelete(todo.id)}
                        color="red.500"
                      />
                    </span>
                  </Flex>
                </Flex>
              </ListItem>
            );
          })}
      </List>
    </Container>
  );
};

export default Home;
