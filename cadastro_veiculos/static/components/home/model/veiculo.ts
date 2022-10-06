export class Veiculo {
    constructor(
        id?: number, 
        veiculo?: string, 
        marca?: string,
        ano?: number,
        cor?: string, 
        descricao?: string,
        vendido?: any,
        created?: Date,
        updated?: Date,
        ) {
        this.id = id;
        this.veiculo = veiculo;    
        this.marca = marca;
        this.ano = ano;
        this.descricao = descricao;
        this.vendido = vendido;
        this.created = created;
        this.updated = updated;
        this.cor = cor;
    }
    public id: number;
    public veiculo: string; 
    public marca: string;
    public ano: number;
    public descricao: string;
    public vendido: any;
    public created: Date;
    public updated: Date;
    public cor: string;
}
