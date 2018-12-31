import numpy

A = numpy.array([
    [4, 1],
    [6, 3]
])

w, v = numpy.linalg.eig(A)

print('e-values:\n', w)
print('e-vectors:\n', v)
