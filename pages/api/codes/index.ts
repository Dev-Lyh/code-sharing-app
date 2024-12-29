import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const codesCollections = collection(db, 'codes');

  if (req.method === 'GET') {
    try {
      const snapshot = await getDocs(codesCollections);
      const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(apps);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const newCode = req.body;
      const docRef = await addDoc(codesCollections, newCode);
      res
        .status(201)
        .json({ id: docRef.id, message: 'Code criado com sucesso!' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
