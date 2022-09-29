import { createRouter } from "./context";
import { string, z } from "zod";
import { json } from "stream/consumers";
import { prisma } from "@prisma/client";

export const todoRouter = createRouter()
  .mutation("add", {
    input: z.object({
      title: z.string(),
      descreption: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const newTodo = await ctx.prisma.todo.create({
        data: {
          title: input.title,
          descreption: input.descreption,
        },
      });
      return {
        newTodo,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const todos = await ctx.prisma.todo.findMany();
      if (!todos) {
        throw Error("No Todos Aviliable");
      }
      return todos;
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      title: z.string(),
      descreption: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          descreption: input.descreption,
        },
      });
    },
  })
  .mutation("state", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.todo
        .findUnique({
          where: {
            id: input,
          },
        })
        .then((res) => {
          return ctx.prisma.todo.update({
            where: {
              id: input,
            },
            data: {
              isDone: !res?.isDone,
            },
          });
        });
    },
  });
