import axios from "axios";

export async function getProduct(id: string) {
  try {
    const res = await axios.get(`/api/zinc/${id}`);
    console.log('res by res', res);
    return res;
  } catch (err: any) {
    console.error("Error fetching product:", err.response?.data || err.message);
  }
}
