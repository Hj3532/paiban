import axios from 'axios'

export async function searchStore(id) {
  const { data } = await axios.get('/shop/' + id)
  return data
}
