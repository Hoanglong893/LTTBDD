export function Bai4(): Promise<void>{
    return new Promise((resolve, reject) => {
        const num = Math.floor(Math.random()*100);
        if(num>=0){
            console.log("Random number: ", num);
            resolve();
        }else{
            reject("Invalid number");
        }
    }).catch((err) => console.error("Error:", err));
}