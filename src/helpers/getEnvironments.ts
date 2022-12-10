

export const getEnvironments = () => {
    const varaibles = import.meta.env;
    console.log(varaibles)
    return {
        ...varaibles
    }
}