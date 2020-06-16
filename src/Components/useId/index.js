import uniqueId from "lodash.uniqueid";
import {useRef} from "react";


export default function useId() {
    const idRef = useRef("");
    if (idRef.current === "") {
        idRef.current = "id-" + uniqueId();
    }

    return idRef.current;
}
