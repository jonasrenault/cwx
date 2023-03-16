import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class AdminService {
  async checkIsAdmin(): Promise<string> {
    const response = await axios.get(API_URL + 'admin/test-admin')
    return response.data
  }

  async loadFixtures() {
    const response = await axios.post(API_URL + 'admin/fixtures')
    return response.data
  }
}

export default new AdminService()
