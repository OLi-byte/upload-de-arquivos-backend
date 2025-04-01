import {
  createItem,
  updateItem,
  getAllItens,
  getItemById,
  deleteItem,
} from "../services/itemService.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function createItemController(req, res) {
  const { title, description } = req.body;
  const image = req.file;

  try {
    if (!title || !description || !image) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
      });
    }

    const fileBuffer = image.buffer;
    const fileName = `${Date.now()}_${image.originalname}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, fileBuffer, {
        contentType: image.mimetype,
      });

    if (error) {
      return res.status(400).json({
        error: `Houve um problema ao realizar o upload de imagem: ${error.message}`,
      });
    }

    const publicUrl = supabase.storage.from("images").getPublicUrl(fileName);

    const newItem = await createItem(
      title,
      description,
      publicUrl.data.publicUrl
    );

    res.status(201).json({
      message: "O novo item foi adicionado com sucesso",
      item: newItem,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Houve um erro ao adicionar o novo item",
      error: error.message,
    });
  }
}

export async function updateItemController(req, res) {
  const { title, description } = req.body;
  const itemId = parseInt(req.params.id);
  const image = req.file;

  try {
    if (isNaN(itemId)) {
      return res.status(400).json({
        message: "ID do item inválido. Certifique-se de que é um número.",
      });
    }

    let image_url = undefined;
    if (image && image.length > 0) {
      image_url = `/uploads/${image.filename}`;
    }

    const updatedItem = await updateItem(itemId, title, description, image_url);

    res.status(200).json({
      message: "Item atualizado com sucesso",
      item: updatedItem,
    });
  } catch (error) {
    console.error(error.message);

    if (error.message === "Item não encontrado") {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    res.status(500).json({
      message: "Houve um erro ao atualizar o item",
    });
  }
}

export async function getAllItensController(req, res) {
  try {
    const itens = await getAllItens();

    if (!itens || itens.length === 0) {
      return res.status(404).json({ message: "Nenhum item encontrado" });
    }

    res.status(200).json({
      message: "Itens encontrados com sucesso",
      itens: itens,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Houve um erro ao obter os itens",
      error: error.message,
    });
  }
}

export async function getItemByIdController(req, res) {
  const itemId = parseInt(req.params.id);

  try {
    if (isNaN(itemId)) {
      return res.status(400).json({
        message: "ID do item inválido. Certifique-se de que é um número.",
      });
    }

    const item = await getItemById(itemId);

    res.status(200).json({
      message: "Item encontrado com sucesso",
      item: item,
    });
  } catch (error) {
    console.error(error.message);

    if (error.message === "Item não encontrado") {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    res.status(500).json({
      message: "Houve um erro ao obter o item",
      error: error.message,
    });
  }
}

export async function deleteItemController(req, res) {
  const itemId = parseInt(req.params.id);

  try {
    if (isNaN(itemId)) {
      return res.status(400).json({
        message: "ID do item inválido. Certifique-se de que é um número.",
      });
    }

    await deleteItem(itemId);

    res.status(200).json({
      message: "Item excluído com sucesso",
    });
  } catch (error) {
    console.error(error.message);

    if (error.message === "Item não encontrado") {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    res.status(500).json({
      message: "Houve um erro ao excluir o item",
      error: error.message,
    });
  }
}
