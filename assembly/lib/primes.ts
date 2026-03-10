let sieveBuffer = new Uint8Array(0);

export function findPrimes(limit: i32): i32 {
  if (sieveBuffer.length <= limit) {
    sieveBuffer = new Uint8Array(limit + 1);
  } else {
    sieveBuffer.fill(0);
  }

  let primeCount = 0;

  for (let candidate = 2; candidate <= limit; candidate++) {
    if (unchecked(sieveBuffer[candidate]) === 0) {
      primeCount++;

      for (let multiple: i64 = <i64>candidate * candidate; multiple <= limit; multiple += candidate) {
        unchecked(sieveBuffer[<i32>multiple] = 1);
      }
    }
  }
  return primeCount;
}

/* 

NOTES:

- unchecked is a best practice for writing high-performance AssemblyScript because it removes
the bounds-checking overhead from every single iteration of the loop.


*/