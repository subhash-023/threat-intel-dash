
const base_url = import.meta.env.VITE_API_BASE_URL

export const getThreatsData = async (page = 1, limit = 20, category = '', search = '') => {
    try {
        const response = await fetch(`${base_url}/api/threats?page=${page}&limit=${limit}&category=${category}&search=${search}`)
        if (!response.ok) {
            return null
        }
        return response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getThreatsDataById = async (id) => {
    try {
        const response = await fetch(`${base_url}/api/threats/${id}`)
        if (!response.ok) {
            return null
        }
        console.log(response.json())
        return response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getThreatsStats = async () => {
    try {
        const response = await fetch(`${base_url}/api/threats/stats`)
        if (!response.ok) {
            return null
        }
        // console.log(await response.json())
        return response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}