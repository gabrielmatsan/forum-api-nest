import { left, right, Either } from './either'

function doSomething(shouldSucess: boolean): Either<string, string> {
  if (shouldSucess) {
    return right('sucess')
  } else {
    return left('error')
  }
}

it('sucess result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

it('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
