import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SavedPortfolio } from "@/lib/types";

export async function savePortfolio(uid: string, portfolio: SavedPortfolio) {
  const ref = collection(db, "users", uid, "portfolios");
  await addDoc(ref, {
    ...portfolio,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function listPortfolios(uid: string) {
  const ref = collection(db, "users", uid, "portfolios");
  const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<SavedPortfolio, "id">)
  }));
}

export async function renamePortfolio(uid: string, portfolioId: string, name: string) {
  await setDoc(
    doc(db, "users", uid, "portfolios", portfolioId),
    { name, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function removePortfolio(uid: string, portfolioId: string) {
  await deleteDoc(doc(db, "users", uid, "portfolios", portfolioId));
}
