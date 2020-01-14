module.exports = function parseStringArray(techs){
    // as tecnologias são recebidas como uma unica string separada por virugla
    // então vamos separar as tecnologias com split() e para eliminar espaços em 
    //branco vamos percorrer o array com map() e remover os espaços com trim()
    return techsArray = techs.split(',').map(tech => tech.trim());
}