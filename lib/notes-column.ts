 // Determine number of columns based on screen width
 
 // Mobile: 1 column
 // Tablet: 2 columns
 // Desktop: 3 columns
 
    export const getNumColumns = (screenWidth: any) => {
        if (screenWidth >= 1024) return 3;
        if (screenWidth >= 768) return 2;  
        return 1; 
    };
