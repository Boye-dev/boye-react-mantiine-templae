import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

export const handleErrors = (error: any, title?: string) => {
  if (error instanceof AxiosError) {
    const errorMessgaes: string[] = [];
    const mainError = error.response?.data;
    if (mainError.error === 'Not Acceptable') {
      mainError.message.map((item: { errors: string[]; field: string }) =>
        item.errors.map((err) => errorMessgaes.push(err))
      );
      errorMessgaes?.map((message) =>
        notifications.show({
          title: title || mainError?.error || 'Something Went Wrong',
          message,
          color: 'red',
        })
      );
    } else {
      notifications.show({
        title: title || mainError?.error || 'Something Went Wrong',
        message: mainError.message,
        color: 'red',
      });
    }
  }
};
