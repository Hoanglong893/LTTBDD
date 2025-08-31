import {Bai1} from "./Bai1";
import {Bai2} from "./Bai2";
import {Bai3} from "./Bai3";
// import {Bai4} from "./Bai4";
import {Bai6} from "./Bai6";
import {Bai7} from "./Bai7";
import {Bai8} from "./Bai8";
import {Bai9} from "./Bai9";
import {Bai10} from "./Bai10";

async function main(){
    console.log("Bai 1:", await Bai1());
    console.log("Bai 2:", await Bai2());

    try {
        await Bai3();
    }catch(err){
        console.error("Bai3 error:", err);
    }

    // await Bai4();
    console.log("Bai 5:", "Task done");
    console.log("Bai 6:", await Bai6());
    console.log("Bai 7:", await Bai7());
    console.log("Bai 8:", await Bai8());
    console.log("Bai 9:", await Bai9([1, 2, 3, 4, 5, 6]));
    await Bai10();
}

main();