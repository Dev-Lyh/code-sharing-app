import { db } from '../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const codeDoc = doc(db, 'codes', id);

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      await updateDoc(codeDoc, updates);

      return res.status(200).json({ message: 'Empresa atualizada com sucesso!' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Caso o método não seja PUT, retorne um erro 405 Method Not Allowed
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
