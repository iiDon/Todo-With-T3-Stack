import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Input,
  Textarea,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { trpc } from "../src/utils/trpc";

type Props = {
  id: string;
  title: string;
  descreption: string;
};

const EditTodo: React.FC<Props> = (Props) => {
  const title = useRef<HTMLInputElement>(null);
  const descreption = useRef<HTMLTextAreaElement>(null);
  const updateTodo = trpc.useMutation(["todo.update"]);

  const SaveEdit = (id: string): void => {
    updateTodo.mutate({
      id,
      title: title.current?.value.toString() || Props.title,
      descreption: descreption.current?.value.toString() || Props.descreption,
    });
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <EditIcon onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Your Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={2}>
              <Text>Title:</Text>
              <Input
                textColor={"black"}
                ref={title}
                defaultValue={Props.title}
              />
            </Box>
            <Box>
              <Text>Descreption:</Text>
              <Textarea
                rows={15}
                textColor={"black"}
                ref={descreption}
                defaultValue={Props.descreption}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => SaveEdit(Props.id)}
              colorScheme="blue"
              mr={3}
            >
              Save
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditTodo;
