const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`

const createUser = async (userData: any) => {
    const res = await fetch(`http://${API_BASE_URL}/user`, {
        method: "POST",
        body: JSON.stringify(userData)
    })
    return await res.json();
}

export {createUser}