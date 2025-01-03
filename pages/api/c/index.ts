import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

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

      console.log(updates)

      return res
        .status(200)
        .json({ message: 'Empresa atualizada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
