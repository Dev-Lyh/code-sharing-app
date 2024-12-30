import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
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

  if (req.method === 'GET') {
    try {
      const docSnapshot = await getDoc(codeDoc);
      if (!docSnapshot.exists()) {
        return res.status(404).json({ message: 'Code não encontrado' });
      }
      res.status(200).json({ id, ...docSnapshot.data() });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
