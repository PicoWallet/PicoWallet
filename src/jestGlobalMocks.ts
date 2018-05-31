const mock = () => {
  let storage = {};
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {})
  };
};
Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

export const mockWallet = {"name":"Ya-server","accounts":{"0":{"brain":false,"algo":"pass:enc","encrypted":"b670273e08127e95e6e9ab9da05826937af7f22d4231287dc8042a77db242ec7255d8b20af59f3f8e7b238df793e40eb","iv":"256f8cb638c64cc9996df97d0e9aa6d8","address":"TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ","label":"Primary","network":-104}}};
export const MOCK4 = {"meta":{"innerHash":{},"id":0,"hash":{"data":"d95b29d5cbdfec11b33e49d81222e814f226726ae8a9564c22289bcf4b2e868f"},"height":1363432},"transaction":{"timeStamp":92673131,"amount":10000000,"signature":"947e8294e5fe5d0a5cfd3b7a6c8ebb4bf7da7cf446a65cddc5ce72b9d77139f2fbbf0b247699cf8bf1e72c2a436d701f0a6a48e7cf484780166c159a06944704","fee":150000,"recipient":"TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ","type":257,"deadline":92676731,"message":{"payload":"54414d483435325044545859414e4a464457585650584648534145424e32335a374e4b50574a4550","type":1},"version":-1744830463,"signer":"a2fcf7df36c66d79b6cf0b0e4bb0233f4015024788be460807cb58d3ded778f5"}};

