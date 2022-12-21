export default ({IDL}) => {
    const CommonError = IDL.Variant({
        InvalidToken: IDL.Text,
        Other: IDL.Text,
    });
    return IDL.Service({
        license: IDL.Func([IDL.Text], [IDL.Variant({ok: IDL.Text, err: CommonError})], ['query']),
    });
};
export const init = ({IDL}) => {
    return [];
};
