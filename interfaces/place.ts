export interface StudentPresentInterface {
    eta: string;
    fee: number;
    max: number;
    name: string;
    email: string;
    returning: string;
}

export interface PlaceInterface {
    address: string;
    name: string;
    students: StudentPresentInterface[];
}
