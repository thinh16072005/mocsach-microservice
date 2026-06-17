export async function my_request(endpoint, init){
    //Truy van den endpoint
    const response = await fetch(endpoint, init);

    //Neu bi tra ve loi
    if(!response.ok){
        throw new Error(response.statusText);
    }

    //Tra ve Json neu ok
    return response.json();
}
