
export const getRequest = async () => {
    const url = `http://localhost:8080/path`;
    const response = await fetch(url);
    return response.json();
};