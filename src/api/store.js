// import request from '@/utils/request'
import axios from 'axios'
// export const reqStoreList = () => ({ url: 'localhost:8080/emp/1/2', method: 'get' })
export async function getStoreList() {
  const { data } = await axios.get('/shop')
  return data
}
