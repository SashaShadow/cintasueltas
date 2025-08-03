import { utils, writeFile } from "xlsx-js-style";

export const crearExceldeTabla = (tablaid) => {
    const excelFile = utils.table_to_book(document.getElementById(tablaid), {sheet:"VentaEntradas"});

    const cells1 = Object.keys(excelFile.Sheets["VentaEntradas"]).filter(cell => cell.length === 2)
    .filter(cell => cell.includes("1"))

    for (let i = 0; i < cells1.length; i++) {
        excelFile.Sheets["VentaEntradas"][cells1[i]].s = {
            font: {
                name: "Calibri",
                sz: 9,
                color: { rgb: "FFFFFF" },
            },
            alignment: {
                wrapText: false
            },
            fill: {
                fgColor: { rgb: "ba0169" }
            }
        }
    }

    excelFile.Sheets.VentaEntradas["!cols"] = [ { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, 
        { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, 
        { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, 
        { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 } ];
    
    writeFile(excelFile, 
        `VentaEntradas${new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3)}.xlsx`);
}