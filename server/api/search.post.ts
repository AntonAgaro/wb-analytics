export default defineEventHandler(async (event) => {
    const {searchValue} = await readBody(event)
    if (!searchValue)  {
        return { body: { error: 'Please provide a search value' } }
    }

    // Данные через поиск WB
    const dataByWBSearch = await $fetch(`https://search.wb.ru/exactmatch/ru/common/v7/search?appType=64&curr=rub&dest=-1257786&query=${searchValue}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false`)

    if (!dataByWBSearch)  {
        return { body: { error: 'No data found' } }
    }

    // Получаем id карточек для запроса к MPstats
    const data = await JSON.parse(dataByWBSearch as string)
    const cardsIdArray = data?.data?.products.map((item: Record<string, any>) => item.id)
    const cardsIdStringForQuery = cardsIdArray.join(';')


    // https://card.wb.ru/cards/detail?appType=0&curr=rub&dest=-1257786&spp=30&nm=244298736;242645539;207770069;259750428;154390925;142063234;251485419;269359209;269359207;180314239;207223453;139698183;248616627;214729400;175975740;174601011;251717713;251485420;221743565;195354086;177293602;269359211;174854631;229622359;201882899;253537974;179631500;127844006;241370698;260304392;204937365;240652420;177293603;249555510;263610556;241370694;23651257;226121136;198142040;241370696;249555511;241368687;170710125;241368690;241370697;241368689;170573333;175975747;263610557;170710139;179632748;241370695;257474235;268010483;241368688;149857378;195355966;246437653;222706375;235212137;223711813;149857376;241370701;241368692;248954171;201073766;241370699;262631062;158674229;274630620;245224414;13228916;262401480;169586874;110728279;150629773;260304394;241368691;241368693;213852621;38826575;259336753;147532312;142220580;213828252;164039012;266477878;255725736;260304391;258261344;169533981;213852610;262633689;241980552;257814556;257846536;241383881;197259142;217473051;247650660

    // Получаем данные по карточкам через MPstats
    const resByMPstats = await fetch(`https://card.wb.ru/cards/detail?appType=0&curr=rub&dest=-1257786&spp=30&nm=${cardsIdStringForQuery}`)
    const dataByMPstats = await resByMPstats.json()
    return {dataByWBSearch, dataByMPstats}
})