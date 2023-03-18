// import request from '@/utils/request'
import axios from 'axios'
// export const reqStoreList = () => ({ url: 'localhost:8080/emp/1/2', method: 'get' })
// export async function getStoreList() {
//   const { data } = await axios.get('/shop')
//   return data
// }
export async function getEmployeeList(shopId, page, limit) {
  const path = '/' + limit
  const { data } = await axios.get('/emp/' + shopId + '/' + page + path)
  return data
}
