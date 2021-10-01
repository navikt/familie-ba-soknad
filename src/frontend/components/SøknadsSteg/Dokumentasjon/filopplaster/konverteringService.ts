import { preferredAxios } from '../../../../context/axios';
import { basePath } from '../../../../Miljø';

export const konverter = async (fil: File): Promise<File> => {
    const response = await preferredAxios.request<Blob>({
        url: `${basePath}konverter`,
        withCredentials: true,
        data: await fil.arrayBuffer(),
        method: 'POST',
        responseType: 'blob',
    });

    return new File([response.data], fil.name, {
        type: response.headers['content-type'],
    });
};
