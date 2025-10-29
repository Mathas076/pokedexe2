import React from 'react';
import { Text } from 'react-native';
interface CustomTextProps{
    variant:"Dato"|"Descripcion"|"Nombre";
    dark?:boolean;
    children: React.ReactNode;
}

const CustomText = ({variant, dark =false, children}:CustomTextProps) => {
  return (
     <Text className={styleSelector(variant,dark)}>
        {children}
    </Text>
 )
}

function styleSelector(variant:any,dark:boolean){
    let style = ""
    if(dark == true){
        style += "text-[#9F211F] "
    }else{
        style += "text-white "
    }
    
    switch(variant){
        case "Dato":
            return style + "font-semibold text-sm cyan-400" ;
        case "Descripcion":
            return style + "font-semibold text-base" ;
        case "Nombre":
            return style + " font-bold text-xl" ;
    }
}

export default CustomText