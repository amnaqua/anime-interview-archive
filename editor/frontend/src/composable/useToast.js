import { ref } from "vue";

const toasts = ref([]);

export function useToast() {
    function show(
        message,
        type = "error"
    ) {
        const id = Date.now();

        toasts.value.push({
            id,
            message,
            type
        });

        setTimeout(() => {
            remove(id);
        }, 4000);
    }

    function remove(id) {
        toasts.value =
            toasts.value.filter(
                toast =>
                    toast.id !== id
            );
    }

    return {
        toasts,
        show,
        remove
    };
}