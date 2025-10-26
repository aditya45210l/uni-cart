import axios from "axios";

export async function getProduct(id: string) {
  try {
    const res = await axios.get(`/api/zinc/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching product:", err.response?.data || err.message);
  }
}
