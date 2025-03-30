import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createItem(title, description, image_url) {
  try {
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        image_url,
      },
    });
    return newItem;
  } catch (error) {
    console.error("Erro ao criar item:", error.message);
    throw error;
  }
}

export async function getAllItens() {
  try {
    const itens = await prisma.item.findMany();
    return itens;
  } catch (error) {
    console.log("Erro ao buscar itens:", error.message);
    throw error;
  }
}

export async function getItemById(itemId) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    return item;
  } catch (error) {
    console.log("Erro ao buscar item por ID:", error.message);
    throw error;
  }
}

export async function updateItem(itemId, title, description, image_url) {
  try {
    const existingItem = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!existingItem) {
      throw new Error("Item não encontrado");
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        title,
        description,
        image_url,
      },
    });

    return updatedItem;
  } catch (error) {
    console.error("Erro ao atualizar item:", error.message);
    throw error;
  }
}

export async function deleteItem(itemId) {
  try {
    const existingItem = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!existingItem) {
      throw new Error("Item não encontrado");
    }

    await prisma.item.delete({
      where: { id: itemId },
    });
  } catch (error) {
    console.error("Erro ao excluir item:", error.message);
    throw error;
  }
}
