const BASE_URL = "http://localhost:5000/api/videos";

export async function like(values) {
    try {
        const response = await fetch(`${BASE_URL}/addLike`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        });
        const message = await response.json();
        return message;
    } catch (error) {
        console.error(error);
    }
}

export async function unLike(values) {
    try {
        const response = await fetch(`${BASE_URL}/removeLike`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        });
        const message = await response.json();
        return message;
    } catch (error) {
        console.error(error);
    }
}

export async function dislike(values) {
    try {
        const response = await fetch(`${BASE_URL}/addDislike`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        });
        const message = await response.json();
        return message;
    } catch (error) {
        console.error(error);
    }
}

export async function unDislike(values) {
    try {
        const response = await fetch(`${BASE_URL}/removeDislike`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        });
        const message = await response.json();
        return message;
    } catch (error) {
        console.error(error);
    }
}