

export const getEnvironments = () => {
    const varaibles = import.meta.env;
    return {
        ...varaibles
    }
}