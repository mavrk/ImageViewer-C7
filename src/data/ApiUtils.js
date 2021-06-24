export const URLConfig = {
    allMediaUrl: "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,username,timestamp",
    baseUrl: "https://graph.instagram.com"
}

// export const getMediaData = () => {
//     let url = `${URLConfig.allMediaUrl}&access_token=${sessionStorage.getItem('access-token')}`;
//     fetch(url,{
//         method: 'GET',
//     }).then(response => response.json()
//     ).then((jsonResponse) => { 
//         console.log(jsonResponse.data);
//         return jsonResponse.data;
//     }).catch((error) => {
//         console.log('error media data',error);
//     });
// }