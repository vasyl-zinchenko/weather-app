<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal">
        <dialog open>
          <p>Are you sure you want to remove this location?</p>
          <div class="modal__action">
            <button class="button button__save" @click="confirm">
              Confirm
            </button>
            <button class="button button__cancel" @click="cancel">
              Cancel
            </button>
          </div>
        </dialog>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const emits = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emits('confirm');
};

const cancel = () => {
  emits('cancel');
};
</script>

<style scoped lang="scss">
dialog {
  padding: 20px;
  margin: auto;
  border-radius: 5px;
}

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background-color: #00000046;

  &__action {
    display: flex;
    justify-content: end;
    gap: 10px;
    margin-top: 20px;
  }
}

dialog {
  width: 250px;
  top: 30%;
  border: none;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.button {
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 5px;
}

.button__save {
  background-color: #04aa6d;
  color: white;
  color: white;
}

.button__cancel,
.button__delete {
  background-color: #e51d39;
  color: white;
  color: white;
}
</style>
